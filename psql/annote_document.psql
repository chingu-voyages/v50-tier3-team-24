CREATE TABLE public.annote_document (
		document_id	uuid DEFAULT gen_random_uuid(),
		user_id uuid,
		slug TEXT,
		title TEXT,
		blocks JSONB [],
		description TEXT,
		created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
		source_url TEXT,
		image_url TEXT,
		visibility visibility DEFAULT 'private',
		PRIMARY KEY (document_id)
		CONSTRAINT fk_user
    	FOREIGN KEY(user_id) 
        REFERENCES users(user_id)
);