# Machine data v1

Public, source-linked machine data for an on-device iPhone tool. No photographs, OCR text, store identifiers, inventory counts, user inputs, credentials or user history are included. Machine selection is not a statement that a particular store has installed these machines.

## Current release

- Schema: 1; revision: 1.
- Knowledge snapshot: 2026-10-25 (not the date of a new web verification).
- 63 machines, 10 maximum-ceiling comparison rules for 7 machines, and 53 conditional guidance records.
- Public analysis sources are linked per record. `verified` describes a prior public-source review, not manufacturer certification or a prediction of a machine's actual internal state.

## Publishing updates

Edit the JSON only after checking the exact machine generation, source text and counter units. Increment `revision` for every release. Machine data, numerical rules and benefit guidance must be updated as one JSON file. Preserve source URLs and honest `checkedAt` dates. If evidence is insufficient, mark a machine as draft/unknown and do not attach directional rules. Do not convert lamp games into CZ/AT/GB intervals, liquid-crystal points or cycles without evidence. Do not mark store installation for newly added machine entries.

The iPhone checks the fixed raw.githubusercontent.com URL on Wi-Fi at launch, at most once per day, and offers a manual refresh. It retains its last valid data offline, validates schema/IDs/sources/rules/size, rejects older revisions, and applies updates between machine sessions. Only a GET request for this public file is made. No photo or history upload endpoint exists.

This is automatic delivery of reviewed updates. Discovery of new machines, extraction of new analysis pages and automatic factual verification are NOT implemented by this feed. Publishing the initial snapshot does not make its information continuously current.

## Cost boundary

Use existing public GitHub file hosting only. No paid AI API, paid server, additional storage, Git LFS, custom domain, paid runner or subscription is used. No update workflow is added. If the free distribution method stops being available, keep using cached data and stop updating; never switch to a paid service automatically.
