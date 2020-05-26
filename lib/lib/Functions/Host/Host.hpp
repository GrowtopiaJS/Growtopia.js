#ifndef HOST_HPP
#define HOST_HPP

namespace Host
{
	Napi::Number init(const Napi::CallbackInfo& info);
	Napi::Value checkIfConnected(const Napi::CallbackInfo& info);
	void create(const Napi::CallbackInfo& info);
	void start(const Napi::CallbackInfo& info);
	Napi::String getIP(const Napi::CallbackInfo& info);
}

#endif
