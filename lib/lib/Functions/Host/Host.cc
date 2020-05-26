#include <iostream>
#include <enet/enet.h>
#include <map>
#include "napi.h"
#include "Host.hpp"
#include "../../Structs/GamePacket.hpp"
#include "../../Utils/Utils.hpp"

using namespace std;
using namespace Napi;

Function emit;
ENetAddress address;
ENetEvent event;

namespace Host
{
	Number init(const CallbackInfo& info)
	{
		Env env = info.Env();
		return Number::New(env, enet_initialize());
	}

	Value checkIfConnected(const CallbackInfo& info)
	{
		Env env = info.Env();
		string peerID = info[0].As<String>().Utf8Value();
		ENetPeer* peer = Utils::getPeer(peerID);

		if (!peer)
		{
			return Boolean::New(env, false);
		}

		else if (peer->state != ENET_PEER_STATE_CONNECTED)
		{
			return Boolean::New(env, false);
		}

		else
		{
			return Boolean::New(env, true);
		}
	}

	void create(const CallbackInfo& info)
	{
		Object data = info[0].As<Object>();

		int channels = data.Get("channels").As<Number>().Uint32Value();
		int peers = data.Get("peers").As<Number>().Uint32Value();
		int ico = data.Get("ico").As<Number>().Uint32Value();
		int ogo = data.Get("ogo").As<Number>().Uint32Value();

		address.host = ENET_HOST_ANY;
		address.port = data.Get("port").As<Number>().Uint32Value();

		Utils::setAddress(address);
		Utils::setServer(enet_host_create(&address, channels, peers, ico, ogo));
	}

	void start(const CallbackInfo& info)
	{
		Env env = info.Env();
		ENetHost* server = Utils::getServer();

		if (server == NULL)
		{
			TypeError::New(env, "Server is null, make sure to create a host first.");
		}

		server->checksum = enet_crc32;
		enet_host_compress_with_range_coder(server);

		emit = info[0].As<Function>();

		while(enet_host_service(server, &event, 1000) > 0)
		{
			ENetPacket* packet = event.packet;
			switch(event.type)
			{
				case ENET_EVENT_TYPE_CONNECT:
				{
					string peerID = Utils::getUID(event.peer);
					int length = peerID.length();
					char* cpeerID = new char[length + 1];

					strcpy(cpeerID, peerID.c_str());

					event.peer->data = cpeerID;

					Utils::peers.emplace(peerID, event.peer);

					emit.Call({
						String::New(env, "connect"),
						String::New(env, peerID)
					});
					break;
				}

				case ENET_EVENT_TYPE_RECEIVE:
				{
					string peerID = Utils::getUID(event.peer);

					emit.Call({
						String::New(env, "receive"),
						ArrayBuffer::New(env, packet->data, packet->dataLength),
						String::New(env, peerID)
					});
					break;
				}

				case ENET_EVENT_TYPE_DISCONNECT:
				{
					char* cpeerID = ((char*)event.peer->data);

					emit.Call({
						String::New(env, "disconnect"),
						String::New(env, cpeerID)
					});
					break;
				}
			}
		}
	}

	String getIP(const CallbackInfo& info)
	{
		Env env = info.Env();
		string peerid = info[0].As<String>().Utf8Value();
		ENetPeer* peer = Utils::getPeer(peerid);

		char clientConnection[16];
		enet_address_get_host_ip(&peer->address, clientConnection, 16);

		string ip(clientConnection);
		return String::New(env, ip);
	}
}
