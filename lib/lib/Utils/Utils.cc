#include <iostream>
#include "napi.h"
#include <enet/enet.h>
#include <cstring>
#include <map>
#include "../Structs/GamePacket.hpp"
#include "Utils.hpp"

typedef unsigned int enet_uint32;

using namespace std;
using namespace Napi;

Utils::Utils()
{}

Utils::Utils(ENetHost* _server, ENetAddress _address)
{
	server = _server;
	address = _address;
}

void Utils::setAddress(ENetAddress _address)
{
	address = _address;
}

void Utils::setServer(ENetHost* _server)
{
	server = _server;
}

ENetHost* Utils::getServer()
{
	return server;
}

ENetAddress Utils::getAddress()
{
	return address;
}

void Utils::addPeer(string id, ENetPeer* peer)
{
	peers.emplace(id, peer);
}

ENetPeer* Utils::getPeer(string id)
{
	return peers[id];
}

// credits to gt noobs
string Utils::getUID(ENetPeer* peer)
{
	if(peer == NULL) return 0;

	string ret;
	string serverID;

	int serverIDSize = serverID.size();

	ret.resize(serverIDSize + 8);

	unsigned int id = peer->connectID;
	static const char* digits = "0123456789ABCDEF";

	for (int i=0; i<serverIDSize; ++i)
		ret[i] = serverID[i];

	for (int i=0; i<8; ++i)
		ret[i+serverIDSize] = digits[(id>>(i<<2)) & 0x0f];

	return ret;
}
