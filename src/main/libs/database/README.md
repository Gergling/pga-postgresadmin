* This is simply the orchestration for local and remote database.
* Reads and writes should be directly to the local.
* Sync should be in the "background" when internet is available.
  * Should probably keep a sync list or something on both sides to quickly check for a list of things which need syncing.
  * Granularity can start with the collection level. Each collection will have a time property. I'm thinking of just using epochMilliseconds in UTC. I don't see why I'd care about the timezone TBH.
  * If the user is offline, they can continue to use the application as normal. However, the sync will not happen until they are back online.
  * The sync should be a one-way sync from local to remote. If the user goes back online, the changes on the local database will be synced to the remote database.
  * If the local data is empty or non-existent, it should probably get repopulated first.
  * Some cases may have syncing disabled. The logic for that will be hardcoded.
