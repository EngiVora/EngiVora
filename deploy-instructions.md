# Deployment Instructions for EngiVora

## Manual Deployment Steps

1. **Build the Application**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel Using Dashboard**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Select your GitHub repository (or import manually)
   - Set the following configuration:
     - Framework Preset: Next.js
     - Root Directory: Leave empty (or set to the directory containing your Next.js app)
     - Build Command: `next build`
     - Output Directory: `.next`
     - Install Command: `npm install`

3. **Environment Variables** (if needed):
   - Add any environment variables from your `.env.local` file to the Vercel project settings

## Alternative CLI Deployment

If you want to use the CLI, try these commands:

```bash
# Login to Vercel
vercel login

# Remove existing Vercel configuration
rm -rf .vercel

# Link to a new project
vercel link --project engivora-new

# Deploy
vercel deploy --prod
```

## Troubleshooting

If you encounter path issues:
1. Make sure you're in the correct directory
2. Check that your project structure is correct
3. Ensure all dependencies are installed with `npm install`