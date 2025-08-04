# Oracle Queries API - Batch Processing

This API implements a lean batch processing approach for fetching and processing oracle queries. Instead of caching all request data in Redis, the system processes data incrementally in batches and stores only the latest processed timestamp.

## Architecture

### Key Components

1. **Batch Processing (`_batch.ts`)**

   - Manages incremental data processing
   - Stores latest processed timestamp per page/chain combination
   - Processes data in configurable time-based batches

2. **Fetch with Time Filtering (`_fetch.ts`)**

   - Fetches data from subgraphs with timestamp filtering
   - Supports time-range queries for efficient batch processing

3. **Main API Endpoint (`index.ts`)**
   - Uses batch processing instead of full data caching
   - Returns processed queries with pagination

### Data Flow

1. Client requests data for a specific page/chain
2. System checks the latest processed timestamp for that combination
3. Fetches and processes data from last timestamp to current time
4. Updates the latest processed timestamp
5. Returns paginated results

## API Endpoints

### Main Endpoint

```bash
GET /api/oracle-queries?page=verify&chainId=1&limit=50&offset=0&forceRefresh=true
```

**Parameters:**

- `page`: "verify" | "propose" | "settled"
- `chainId`: Optional chain ID
- `limit`: Number of results (1-100)
- `offset`: Pagination offset
- `forceRefresh`: Force processing more batches

### Test Endpoint

```bash
GET /api/oracle-queries/test-batch?action=status&page=verify&chainId=1
```

**Actions:**

- `status`: Get batch processing status
- `reset`: Reset latest processed timestamp
- `process`: Process a small batch for testing

## Batch Processing Configuration

### Default Settings

- **Batch Size**: 24 hours (configurable)
- **Max Batches**: 10 per request (configurable)
- **Force Refresh**: 20 batches per request

### Redis Keys

- `oracle-queries:last-processed:{page}:{chainId}`: Latest processed timestamp

## Benefits

1. **Memory Efficient**: No need to cache large datasets
2. **Incremental Processing**: Only processes new data since last update
3. **Scalable**: Can handle large historical datasets by processing in chunks
4. **Flexible**: Configurable batch sizes and limits
5. **Resilient**: Continues processing even if individual batches fail

## Future Enhancements

1. **Smart Caching**: Cache frequently accessed data patterns
2. **Background Processing**: Process batches in background jobs
3. **Compression**: Compress stored timestamps and metadata
4. **Analytics**: Track processing performance and optimize batch sizes
