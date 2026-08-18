
#include "src/Get.h"
#include "src/Delete.h"
#include "src/Patch.h"
#include "src/Post.h"
#include "src/Help.h"
#include "src/FileDB.h"
#include "src/Server.h"
#include "src/App.h"
#include "src/StringOutputParser.h"
#include "src/StringInputParser.h"
#include <memory>
using namespace std;


int main(int argc, char* argv[]) {
    if (argc < 3){
        return 0;
    }
    string ip = argv[1], dataFolder = "data";
    int port = atoi(argv[2]);
    // Data folder can be given by argument.
    if (argc >= 4) {
        dataFolder = argv[3];
    }

    auto inputParser = make_unique<StringInputParser>();
    auto outputParser = make_unique<StringOutputParser>();
    auto db = make_unique<FileDB>(dataFolder); // Initialize database.
    
    map<string, unique_ptr<ICommand>> commands; // Map for each command.
    commands["DELETE"] = make_unique<Delete>(db.get());
    commands["GET"] = make_unique<Get>(db.get());
    commands["PATCH"] = make_unique<Patch>(db.get());
    commands["POST"] = make_unique<Post>(db.get());
    // help should have commands map.
    commands["HELP"] = std::make_unique<Help>(commands);

    App app(commands, *inputParser, *outputParser, *db);
    Server server(ip, port, &app);
    server.run();
    return 0;
}