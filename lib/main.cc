#include <iostream>
#include "napi.h"

using namespace std;
using namespace Napi;

// HANDLE FUNCTIONS TO EXPORT
#include "lib/HandleFunc.hpp"

Object Init(Env env, Object exports)
{
	HandleFunc::reg(env, exports);

	return exports;
}

NODE_API_MODULE(test, Init)
