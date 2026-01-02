const { execSync } = require('child_process')

function run(cmd) {
  console.log('> ' + cmd)
  execSync(cmd, { stdio: 'inherit' })
}

try {
  // Always generate Prisma client
  run('npx prisma generate')

  // Only attempt to push DB schema when DATABASE_URL is provided
  if (process.env.DATABASE_URL) {
    run('npx prisma db push')
  } else {
    console.log('Skipping prisma db push because DATABASE_URL is not set')
  }

  process.exit(0)
} catch (err) {
  console.error('prebuild failed:', err)
  process.exit(1)
}
