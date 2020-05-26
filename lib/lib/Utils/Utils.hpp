#ifndef UTILS_HPP
#define UTILS_HPP

class Utils
{
	private:
		static inline ENetHost* server;
		static inline ENetAddress address;

	public:
		static inline std::map<std::string, ENetPeer*> peers;
		Utils();
		Utils(ENetHost* _server, ENetAddress _address);

		static void setAddress(ENetAddress _address);
		static void setServer(ENetHost* _server);
		static ENetHost* getServer();
		static ENetAddress getAddress();
		static void addPeer(std::string id, ENetPeer* peer);
		static ENetPeer* getPeer(std::string id);
		static std::string getUID(ENetPeer* peer);
};

#endif
