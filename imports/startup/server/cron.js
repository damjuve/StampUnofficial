import { SyncedCron } from 'meteor/percolate:synced-cron';
import { Files } from '/imports/api/file/file.js';

const CLEANING_FILES_INTERVAL = 'every 24 hours';

SyncedCron.config({
  log: false
});

SyncedCron.add({
    name: 'Cron Job - Cleaning temporary files',
    schedule(parser) {
        return parser.text(CLEANING_FILES_INTERVAL);
    },
    job() {
        let five_minutes_ago = new Date();
        five_minutes_ago = five_minutes_ago.setMinutes(five_minutes_ago.getMinutes() - 5);
        Files.remove({
            temporary: true,
            date: { $lt: five_minutes_ago}
        });
    }
});

SyncedCron.start();