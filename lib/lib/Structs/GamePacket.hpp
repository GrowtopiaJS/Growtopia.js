#ifndef GAMEPACKET_HPP
#define GAMEPACKET_HPP

typedef unsigned char BYTE;

struct GamePacket
{
	BYTE* data;
	int len;
	int indexes;
};

#endif
