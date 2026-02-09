# Admin Dashboard Troubleshooting

## Changes Not Persisting

If your changes aren't showing up after refreshing:

### Solution 1: Hard Refresh Browser
- **Chrome/Firefox**: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- **Or**: Open DevTools (F12) → Right-click refresh button → "Empty Cache and Hard Reload"

### Solution 2: Clear Vite Cache
```bash
# Stop the dev server (Ctrl+C), then:
rm -rf node_modules/.vite
npm run dev
```

### Solution 3: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### Solution 4: Check File Is Saved
- Make sure the file is actually saved (check if there's an asterisk * in the file tab)
- Some IDEs auto-save, others require manual save (Ctrl+S)

### Solution 5: Check Browser Console
- Open DevTools (F12) → Console tab
- Look for any errors that might prevent hot reloading
- Check Network tab to see if files are loading

## Sidebar Overlay Issue (Fixed)

The sidebar overlay issue has been fixed. If you still see it:

1. **Hard refresh** your browser (Ctrl+Shift+R)
2. **Restart dev server** if needed
3. The sidebar should now be in normal flow on desktop (not overlapping)

## Vite HMR Not Working

If Hot Module Replacement (HMR) isn't working:

1. **Check vite.config.ts** - Make sure it's correct
2. **Restart dev server** - Sometimes HMR needs a restart
3. **Check browser console** - Look for HMR connection errors
4. **Clear browser cache** - Old cached files can interfere

## Common Issues

### Issue: "Cannot find module" errors
**Solution**: Restart dev server

### Issue: Styles not updating
**Solution**: 
- Hard refresh browser
- Check if Tailwind is compiling (should see Tailwind CSS in browser DevTools)
- Restart dev server

### Issue: Routing not working
**Solution**: 
- Check browser console for errors
- Verify routes in `admin/routes.tsx`
- Make sure you're navigating to correct paths (e.g., `/admin/dashboard`)

### Issue: Database queries failing
**Solution**:
- Check Supabase connection in `src/lib/supabaseClient.ts`
- Verify environment variables are set
- Check browser console for API errors

## Admin Login CORS Error

If you see **"CORS request did not succeed"** or **"Status code: (null)"** when logging in to admin:

### 1. Add your origin to Supabase URL Configuration
1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. Go to **Authentication** → **URL Configuration**
3. Under **Redirect URLs**, add:
   - `http://localhost:8080`
   - `http://localhost:8080/**`
   - `http://127.0.0.1:8080`
   - `http://127.0.0.1:8080/**`
4. If using a different port (e.g. 5173), add that instead
5. **Site URL** can stay as `http://localhost:8080` for local dev

### 2. Check if Supabase project is paused
Free-tier projects pause after ~7 days of inactivity. In the dashboard, check if you see a "Restore project" or "Project paused" message. Restore it if needed.

### 3. Try incognito / disable extensions
- Ad blockers or privacy extensions can block Supabase auth requests
- Test in an incognito/private window with extensions disabled

### 4. Check network/firewall
- Corporate VPNs or firewalls may block requests to Supabase
- Try a different network (e.g. mobile hotspot) to isolate the issue

