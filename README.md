[ ] search on dashboard
[x] update lastPlayed dates via player and refresh ui for that... what are the problems?
      on overviews, it can snap to the top/bottom (if filtering on lastPlayed) and you lose sight/focus of it.
      on details->play->back and sort lastPlayed.bottom, you lose sight/focus of it

Unifying path:
- api creates proper instances
- sorter
- player
- section vms

mvm->controller

tv series STARTED on first episode SHOULD show a resume state... not sure how yet...
  perhaps add a resume item onto the entry for the last played entry? or an aggregation of all resume state %
  this is necessary to show appropriate progress on the overview page...
navigation audio ques
autoselect ui initial elements in keyboard mode (preserve keyboard mode in localStorage for next run, too)

# Ulmas

Unopinionated Local Media Asset Server. **Currently in development**.

# Movies

Based on https://kodi.wiki/view/NFO_files/Movies.

| API Field   | NFO Field  | Required | Patchable | Notes                         |
|-------------|------------|----------|-----------|-------------------------------|
| id [1]      | -          | -        | -         | Hash of path to `.nfo` file   |
| path [1]    | -          | -        | -         | Path to `.nfo` file           |
| media [1]   | -          | -        | -         | Matched media for `movie`     |
| title       | title      | Yes      | No        |                               |
| dateAdded   | dateadded  | No       | No        | Uses `btime` if not in `.nfo` |
| lastPlayed  | lastplayed | No       | Yes       |                               |
| playCount   | playcount  | No       | Yes       |                               |
| plot        | plot       | No       | No        |                               |
| resume      | resume     | No       | Yes       |                               |
| watched [2] | watched    | No       | Yes       | Must be `true` or `false`     |

- [1] Field is a *derived field*. It is **not persisted** in your `.nfo` file.
- [2] Field is a *custom field*. It **is persisted** in your `.nfo` file.

# Series

Based on https://kodi.wiki/view/NFO_files/TV_shows.

| API Field            | NFO Field | Required | Patchable | Notes                              |
|----------------------|-----------|----------|-----------|------------------------------------|
| id [1]               | -         | -        | -         | Hash of path to `.nfo` file        |
| path [1]             | -         | -        | -         | Path to `.nfo` file                |
| images [1]           | -         | -        | -         | Matched images for `tvshow`        |
| episodes [1]         | -         | -        | -         | Collection of `Episode`            |
| dateEpisodeAdded [1] | -         | -        | -         | Derived from `episodes.dateAdded`  |
| lastPlayed [1]       | -         | -        | -         | Derived from `episodes.lastPlayed` |
| totalCount [1]       | -         | -        | -         | Derived from `episodes`            |
| unwatchedCount [1]   | -         | -        | -         | Derived from `episodes.watched`    |
| title                | title     | Yes      | No        |                                    |
| dateAdded            | dateadded | No       | No        | Uses `btime` if not in `.nfo`      |
| plot                 | plot      | No       | No        |                                    |

- [1] Field is a *derived field*. It is **not persisted** in your `.nfo` file.

# Episode

Based on https://kodi.wiki/view/NFO_files/Episodes.

| API Field   | NFO Field  | Required | Patchable | Notes                         |
|-------------|------------|----------|-----------|-------------------------------|
| id [1]      | -          | -        | -         | Hash of path to `.nfo` file   |
| path [1]    | -          | -        | -         | Path to `.nfo` file           |
| media [1]   | -          | -        | -         | Matched media for `episode`   |
| episode     | episode    | Yes      | No        |                               |
| season      | season     | Yes      | No        |                               |
| title       | title      | Yes      | No        |                               |
| dateAdded   | dateadded  | No       | No        | Uses `btime` if not in `.nfo` |
| lastPlayed  | lastplayed | No       | Yes       |                               |
| playCount   | playcount  | No       | Yes       |                               |
| plot        | plot       | No       | No        |                               |
| resume      | resume     | No       | Yes       |                               |
| watched [2] | watched    | No       | Yes       | Must be `true` or `false`     |

- [1] Field is a *derived field*. It is **not persisted** in your `.nfo` file.
- [2] Field is a *custom field*. It **is persisted** in your `.nfo` file.
