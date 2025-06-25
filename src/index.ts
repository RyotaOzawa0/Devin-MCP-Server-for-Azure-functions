
import { app } from '@azure/functions';
app.setup({ enableHttpStream: true　});

import "./functions/createSession";
import "./functions/sendMessage";
import "./functions/uploadFile";
import "./functions/listSessions";
import "./functions/getSession";
import "./functions/updateTags";
