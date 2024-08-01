/* This triggers on update for the annote_document table to update the timestamp */
CREATE TRIGGER set_annote_document_timestamp
BEFORE UPDATE ON annote_document
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();