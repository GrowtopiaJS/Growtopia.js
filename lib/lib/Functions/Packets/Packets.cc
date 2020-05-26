#include <iostream>
#include <enet/enet.h>
#include "napi.h"
#include <map>
#include "../../Structs/GamePacket.hpp"
#include "../../Utils/Utils.hpp"

using namespace std;
using namespace Napi;

namespace Packets
{
	void sendStringPacket(const CallbackInfo& info)
	{
		string id = info[0].As<String>().Utf8Value();
		string data = info[1].As<String>().Utf8Value();

		ENetPeer* peer = Utils::getPeer(id);

		enet_peer_send(peer, 0, enet_packet_create(data.c_str(), data.size(), ENET_PACKET_FLAG_RELIABLE));
		enet_host_flush(Utils::getServer());
	}

	void sendPacket(const CallbackInfo& info)
	{
		string id = info[0].As<String>().Utf8Value();
		Buffer<char> buffer = info[1].As<Buffer<char>>();
		int len = info[2].As<Number>().Uint32Value();

		BYTE* data = (BYTE*)buffer.Data();

		ENetPacket* packet = enet_packet_create(data,
			len,
			ENET_PACKET_FLAG_RELIABLE);

		enet_peer_send(Utils::getPeer(id), 0, packet);
	}

	void sendQuit(const CallbackInfo& info)
	{
		string id = info[0].As<String>().Utf8Value();

		ENetPeer* peer = Utils::getPeer(id);
		enet_peer_disconnect_later(peer, 0);

		Utils::peers.erase(id);
	}

	// credits gt noobs
	void sendPacketRaw(const CallbackInfo& info)
	{
		string peerid = info[0].As<String>().Utf8Value();
		int a1 = info[1].As<Number>().Int32Value();
		Buffer<char> buffer = info[2].As<Buffer<char>>();
		size_t packetDataSize = info[3].As<Number>().Uint32Value();
		void* a4 = (void*)(uint64_t)info[4].As<Number>().Int32Value();

		void* packetData = (void*)buffer.Data();
		ENetPacket* p;
		ENetPeer* peer = Utils::getPeer(peerid);

		if (peer)
		{
			if (a1 == 4 && *((BYTE *)packetData + 12) & 8)
			{
				p = enet_packet_create(0, packetDataSize + *((unsigned int*)packetData + 13) + 5, ENET_PACKET_FLAG_RELIABLE);
				int four = 4;
				memcpy(p->data, &four, 4);
				memcpy((char *)p->data + 4, packetData, packetDataSize);
				memcpy((char *)p->data + packetDataSize + 4, a4, *((unsigned int*)packetData + 13));
				enet_peer_send(peer, 0, p);
			}
			else
			{
				p = enet_packet_create(0, packetDataSize + 5, ENET_PACKET_FLAG_RELIABLE);
				memcpy(p->data, &a1, 4);
				memcpy((char *)p->data + 4, packetData, packetDataSize);
				enet_peer_send(peer, 0, p);
			}
		}
	}
}
