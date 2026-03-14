import { InputNode } from './inputNode';
import { LLMNode } from './llmNode';
import { OutputNode } from './outputNode';
import { TextNode } from './textNode';
import { MathNode } from './mathNode';
import { FilterNode } from './filterNode';
import { NoteNode } from './noteNode';
import { PromptNode } from './promptNode';
import { MergeNode } from './mergeNode';

export const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  math: MathNode,
  filter: FilterNode,
  note: NoteNode,
  prompt: PromptNode,
  merge: MergeNode,
};
