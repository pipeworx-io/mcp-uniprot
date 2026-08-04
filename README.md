# @pipeworx/uniprot

UniProt MCP — the canonical protein-sequence and -function knowledge-base from EBI. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `search(query, format?, size?)` — UniProtKB search (Lucene-style query)
- `get(accession, format?)` — single entry by accession (e.g. P12345)
- `proteomes_search(query, size?)` — search proteomes
- `taxonomy_search(query, size?)` — search NCBI taxonomy as exposed by UniProt
- `keyword(keyword_id)` — UniProt keyword info
- `feature_summary(accession)` — summary of feature annotations (domain, mutagen, etc)

## Data source

`https://rest.uniprot.org/` — public, no API key.

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "uniprot": {
      "url": "https://gateway.pipeworx.io/uniprot/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Uniprot data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
