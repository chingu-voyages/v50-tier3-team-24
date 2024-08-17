# annote.app

Annotate articles with ease. Import article text and annotate them with markers and stickies. Add links and text highlighting.

## Live deploy

https://annote.nuxt.dev/

# Tech Stack

- Frontend + backend: VueJs using Nuxt
- Database: postgreSQL
- Deployment: Nuxthub with Cloudflare

# How to use the app

## Basic usage

1. Register for an account and sign in with your e-mail and password.
2. If you have existing documents, they will appear in a list under the `Library` menu.
3. You can create a new document by clicking the `New` option. Enter a title, description and a URL (coming soon, auto-importing articles by Url!) and then save.
4. After creating a document, you will be taken to the document in edit mode where you can start marking up the text and adding stickies.
5. Create markups using the editor's tool bar, either the + sign that appears, or a pop-up toolbar that appears after highlighting text.

## Creating and deleting sticky annotations

1. Highlight document text.
2. Pop-up toolbar will appear. Click the circle tool (the marker tool) and a color pallet will appear.
3. Chose a marker color. On the right, a new sticky annotation note will appear
4. Fill in the note and click the checkmark to save it.
5. Deleting a sticky involves clearing the associated highlighted text by unselecting the marker tool in the popup. This will delete the sticky.

# Setup your development environment

0. Clone the project
1. Run `pnpm install` then `pnpm dev`
2. Sign up for a supabase instance at supabase.com
3. Create a `.env` file at the root of the project and provide the values as indicated in the `.env.sample` (ie. supabase credentials)
4. Optionally install `pgAdmin` so you can run the SQL scripts to create tables, functions and enums. If you don't want to do this, you can create the tables in the supabase UI, but that can be time consuming.
5. Review the scripts in the `psql` folder and run them using the queryTool in `pgAdmin` to setup the tables etc.
6. Run the development server using `pnpm dev`

# Debugging

3. To debug, in vscode open the debugger tab and run the `nuxt` debug configuration. This is defined in `.vscode/launch.json`.

# Contributing

1. Branch off the dev branch, in the format of `<issueType>/<issue-number>_description-of-task`. For example, `docs/3_update-readme`. `issueType` belongs to any of feat:

- fix:
- chore:
- docs:
- refactor:
  You can also combine them like feat & docs:.

2. Make a PR and have at least 1 person approve it.
3. Once approved, merge your own PR so the commit history shows the author of a PR merging it in.

# Our Team

- David Eastmond: [GitHub](https://github.com/davideastmond) / [LinkedIn](https://www.linkedin.com/in/david-eastmond-2783ab18a/)
- Tandid Alam: [GitHub](https://github.com/Tandid) / [LinkedIn](https://www.linkedin.com/in/tandidalam/)
- Sabih Sarowar: [GitHub](https://github.com/kleenkanteen)
- Joseph Kotvas: [GitHub](https://github.com/joekotvas) / [LinkedIn](https://www.linkedin.com/in/joekotvas/)
