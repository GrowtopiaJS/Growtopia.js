{
  "targets": [
    {
      "target_name": "gtps",
      "sources": [
        "main.cc",
        "lib/HandleFunc.cc",
        "lib/Functions/Packets/Packets.cc",
        "lib/Functions/Host/Host.cc",
        "lib/Structs/GamePacket.cc",
        "lib/Utils/Utils.cc"
      ],
      'include_dirs': [
        "<!@(node -p \"require('node-addon-api').include\")",
      ],
      'conditions': [
        ['OS=="linux"', {
          'cflags!': [ '-fno-exceptions' ],
          'cflags_cc!': [ '-fno-exceptions' ],
          'defines': [ 'NAPI_CPP_EXCEPTIONS' ],
          'cflags_cc': ['-std=c++1z'],
          'libraries': [
            "-lenet"
          ]
        }],

        ['OS=="win"', {
          'libraries': [
            "-lenet64",
            "winmm.lib",
            "ws2_32.lib"
          ],

          'msvs_settings': {
            'VCCLCompilerTool': {
              'AdditionalOptions': ['/std:c++17', '/EHsc']
            }
          },
          'defines': [ 'NAPI_CPP_EXCEPTIONS' ]
        }]
      ]
    }
  ]
}
