interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * UniProt MCP — protein sequence + function database.
 *
 * Auth: none. Docs: https://www.uniprot.org/help/api
 */


const BASE = 'https://rest.uniprot.org';
const UA = 'pipeworx-mcp-uniprot/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'search',
    description: '"Find protein [name]" / "look up [gene] in UniProt" / "BRCA1 / TP53 / insulin protein info" / "all proteins for [organism]" — UniProtKB search via Lucene-style queries (e.g. "gene:BRCA1 AND organism_id:9606" for human BRCA1). UniProt is the authoritative protein-sequence-and-function database — use for protein characterization, function annotation, sequence retrieval, and cross-references to PDB/GO/PubMed.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        format: { type: 'string', description: 'json (default) | tsv | fasta | xml' },
        size: { type: 'number', description: '1-500 (default 25)' },
        fields: { type: 'string', description: 'Comma-sep returned fields (json/tsv only).' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get',
    description: '"Fetch protein [P12345]" / "UniProt entry for [accession]" / "FASTA sequence for [protein]" — single UniProtKB entry by accession (e.g. P12345 or P38398 for BRCA1_HUMAN). Returns full protein record: sequence, function annotations, GO terms, cross-refs, post-translational modifications, variants. Pass format=fasta for sequence only.',
    inputSchema: {
      type: 'object',
      properties: {
        accession: { type: 'string', description: 'e.g. "P12345" or "P38398" (BRCA1_HUMAN)' },
        format: { type: 'string', description: 'json (default) | fasta | xml | txt | gff' },
      },
      required: ['accession'],
    },
  },
  {
    name: 'proteomes_search',
    description: '"Reference proteome for [organism]" / "complete protein set of [species]" — search UniProt reference proteomes (the curated representative protein set per organism). Use as a starting point for genome-scale protein analyses.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        size: { type: 'number' },
      },
      required: ['query'],
    },
  },
  {
    name: 'taxonomy_search',
    description: '"NCBI taxonomy ID for [organism]" / "taxid for [species]" / "look up [Latin name] in NCBI taxonomy" — search NCBI Taxonomy via UniProt\'s mirror. Returns taxonomic IDs you can use as organism_id filters in `search` (9606 = human, 10090 = mouse, 7227 = D. melanogaster, etc).',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string' }, size: { type: 'number' } },
      required: ['query'],
    },
  },
  {
    name: 'keyword',
    description: '"UniProt keyword KW-N info" / "what does keyword [X] mean" — fetch a UniProt controlled-vocabulary keyword by ID. Use to look up annotation tags like "Kinase" / "Membrane" / "Disease-associated".',
    inputSchema: {
      type: 'object',
      properties: { keyword_id: { type: 'string' } },
      required: ['keyword_id'],
    },
  },
  {
    name: 'feature_summary',
    description: '"Domain map of [protein]" / "annotated features of [accession]" / "what regions / sites does [protein] have" — annotated features (domains, active sites, transmembrane regions, mutagenesis sites, glycosylation, disulfide bonds, etc.) for a UniProt accession. Use for structural/functional analysis without pulling the full protein record.',
    inputSchema: {
      type: 'object',
      properties: { accession: { type: 'string' } },
      required: ['accession'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search': {
      const params = new URLSearchParams({
        query: reqStr(args, 'query', '"gene:TP53 AND organism_id:9606"'),
        format: String(args.format ?? 'json'),
        size: String(Math.min(500, Math.max(1, (args.size as number) ?? 25))),
      });
      if (args.fields) params.set('fields', String(args.fields));
      return upGet(`/uniprotkb/search?${params}`, String(args.format ?? 'json'));
    }
    case 'get': {
      const acc = reqStr(args, 'accession', '"P12345"');
      const fmt = String(args.format ?? 'json');
      return upGet(`/uniprotkb/${encodeURIComponent(acc)}.${fmt === 'json' ? 'json' : fmt}`, fmt);
    }
    case 'proteomes_search': {
      const params = new URLSearchParams({
        query: reqStr(args, 'query', '"Homo sapiens"'),
        format: 'json',
        size: String(Math.min(500, Math.max(1, (args.size as number) ?? 25))),
      });
      return upGet(`/proteomes/search?${params}`, 'json');
    }
    case 'taxonomy_search': {
      const params = new URLSearchParams({
        query: reqStr(args, 'query', '"Homo sapiens"'),
        format: 'json',
        size: String(Math.min(500, Math.max(1, (args.size as number) ?? 25))),
      });
      return upGet(`/taxonomy/search?${params}`, 'json');
    }
    case 'keyword': {
      const id = reqStr(args, 'keyword_id', '"KW-0007"');
      return upGet(`/keywords/${encodeURIComponent(id)}.json`, 'json');
    }
    case 'feature_summary': {
      const acc = reqStr(args, 'accession', '"P12345"');
      const data = (await upGet(`/uniprotkb/${encodeURIComponent(acc)}.json`, 'json')) as {
        features?: { type: string; description?: string; location?: unknown }[];
      };
      const counts: Record<string, number> = {};
      for (const f of data.features ?? []) counts[f.type] = (counts[f.type] ?? 0) + 1;
      return { accession: acc, total: data.features?.length ?? 0, by_type: counts };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function upGet(path: string, format: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: format === 'json' ? 'application/json' : 'text/plain', 'User-Agent': UA },
  });
  if (res.status === 404) throw new Error('UniProt: not found');
  if (!res.ok) throw new Error(`UniProt: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  if (format === 'json') return res.json();
  return { format, body: await res.text() };
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
