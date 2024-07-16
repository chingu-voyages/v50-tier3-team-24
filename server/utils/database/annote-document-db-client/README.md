# Annote Document DB Client

## Summary

This is a class that encapsulates the CRUD logic for the annote_document table.

## Functions

### `create_annote_document_table`

This function checks to see if the `annote_document` table is created and if not, creates it. It also checks / creates the `visibilty` enum.

### `trigger_set_timestamp`

Reference: https://x-team.com/blog/automatic-timestamps-with-postgresql
Creates a function that runs when changes are made to a record in the `annote_document`. The `updated_at` property should update with the correct date-time.

## Triggers

### `set_timestamp`

See the reference above.
Runs the `trigger_set_timestamp` when a property on the `annote_document` is changed. This should automate timestamping.

## Enums

### `visbility`

The visibility enum is defined in the public schema. It is either `private` or `public`. Private is the default.

## Schema

This is the current postgreSql structure for `annote_document`. Note that user_id should be a foreign key.

```
document_id	SERIAL PRIMARY KEY,
user_id BIGINT,
slug TEXT,
title TEXT,
body TEXT,
description TEXT,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
source_url TEXT,
image_url TEXT,
visibility visibility DEFAULT 'private'
```
