/* eslint-disable no-console */
// This is a development utility script for debugging JWT tokens
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// Paste token từ login response
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWgyMG1razQwMDAwdjI1b244dHhsbnZmIiwiZW1haWwiOiJsYW10ZDEyM0BnbWFpbC5jb20iLCJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3NjExNDA2MzIsImV4cCI6MTc2MTc0NTQzMn0.w47HSd7mHpA3zN5u0V64_ISOZjIrY-CiCwBDzdJZcI0"

try {
    // decode without verifying(chỉ xem payload)
    const decode = jwt.decode(token)
    console.log('Decoded (without verifi):')
    console.log(decode)

    // verify with secret key (check signature)
    const verified = jwt.verify(token, process.env.JWT_SECRET!)
    console.log('\nVerified (with secret key):')
    console.log(verified)

}
catch (error) {
    console.error('Token invalid:', error)
}