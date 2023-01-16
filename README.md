This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Install the basics

Yarn: https://yarnpkg.com/




### Install MongoDB
Instructions: https://www.mongodb.com/docs/manual/administration/install-community/

### Create folder for storing data

On Mac, create /data/mdata under the home folder, or  ~/data/mdata.

On Windows, create \data\db under the c disk, or c:\data\db.


### Run MongoDB


In command line/terminal:

```bash

# Mac: create ~/data/mdata folder first, and then run the following command in the terminal:
mongod --port 27017 --dbpath ~/data/mdata --replSet rs0 --bind_ip localhost



# Windows: create C:\datea\db  folder first, and then run the following command in the terminal:
mongod  --port 27017 --dbpath "c:\data\db" --replSet rs0 --bind_ip localhost

```
### Install MongoDB GUI

Downlaod MongoDB compass for database GUI (or use commandline if you prefer)
https://www.mongodb.com/products/compass

### Create Collections

You can create collections through MongoDB compass or commandline.

* create a database named "walk_to_joy" 

Please reference /prisma/schema.prisma for a list of collections (everythign that starts with "model XYZ") to create within the database:
* log
* users
* ...

### Configure environment settings

Create a file named ".env" in the root of the project folder with the following content:

.env 

```bash

# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB (Preview) and CockroachDB (Preview).
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="mongodb://localhost:27017/walk_to_joy?readPreference=primary&appname=MongoDB%20Compass&ssl=false&retryWrites=false"

TWILIO_ACCOUNT_SID=[twilio account id]
TWILIO_AUTH_TOKEN=[twilio authentication token]
FITBIT_SUBSCRIPTION_VERIFICATION_CODE=[fitbit subscription verification code]
RESEARCH_INVESTIGATOR_PHONE=[research investigator phone number for SMS]

```

Create a file named ".env.local" in the root of the project folder with the following content:

.env.local

```bash

NEXTAUTH_URL=http://localhost:3000

# might be able to ignore... since we aren't using it specifically anymore?
NEXTAUTH_SECRET=[the secret]

```

### Install dependency

Run the following command in the project folder.

```bash

yarn install

```

### Configure Prisma (for database query)

In addition to the first time, everytime the database schema, /prisma/schema.prisma, is changed, run this command in the project folder.

In a temrinal:

```bash

npx prisma generate

```

### Run the development server:

In a temrinal:

```bash
npm run dev

# or
yarn dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
