import { QueryClient } from '@tanstack/react-query';

export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      // 🛡️ STOP THE TRIPLICATES: Prevents refreshing identical rows when switching app views
      refetchOnWindowFocus: false, 
      
      // 🛡️ BLOCK PARALLEL LOOPS: Stops failed requests from retrying 3 times back-to-back
      retry: false,                
      
      // CACHE PROTECTION: Keeps data records safely cached in memory for 5 minutes
      staleTime: 1000 * 60 * 5,    
    },
  },
});
