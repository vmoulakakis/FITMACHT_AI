# FITMATCH: offline, free Hugging Face embedding pipeline

Selected: https://huggingface.co/intfloat/multilingual-e5-small (MIT; Greek and multilingual).

From scripts/ml run npm install, then npm run build-index. Models are downloaded once and execute locally on CPU; hosting and machine resources are not free of cost.

The script indexes only explicitly attributed policy notes in data/knowledge_policy.json. It uses the passage: prefix required by E5, produces an untracked local JSON vector file, and never invents product specifications, prices or commissions.

Do NOT load this model on initial mobile page visits. Query-side retrieval is not yet deployed and has not been benchmarked. A future service must embed each query with query: prefix and the same pinned model, rank audited document chunks by cosine and cite source records. Use deterministic commercial rules regardless of AI response.

Status: implementation committed; no claim that model weights were downloaded or that the semantic index is being used live.
