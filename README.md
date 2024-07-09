deployed: https://board-iota-pied.vercel.app/  

a simple imageboard website made using reactjs, nextjs, tailwindcss.  
-authentication system using nextauth.js, encrypted passwords using bcryptjs.  
-rough profile page to show the logged in user  
-users make threads/replies with pictures/gif/videos(planned).  
-the files uploaded are stored with aws s3 storage service.  
-when the files are uploaded. their thumbnails are generated and uploaded using sharp library  
-users can hover over the thumbnail pictures when on the homepage to preview it.  
-users can click thumbnail pictures when inside a thread to show the default images, and click again to go back to thumbnails  
-users can hover over the timestamps of threads/replies to show a tooltip of how long it's been since it was created.  


locally: npm run dev


    .env
    # MONGODB
    MONGODB_URI=your-mongodb-uri

    # NEXTAUTH
    NEXTAUTH_SECRET=your-nextauth-secret

    # AWS S3
    AWS_ACCESS_KEY_ID=your-aws-access-key-id
    AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
    AWS_REGION=your-aws-region
    S3_BUCKET_NAME=your-s3-bucket-name

    # GITHUB
    GITHUB_TOKEN=your-github-token