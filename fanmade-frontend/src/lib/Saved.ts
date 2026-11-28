const savedSet = new Set<string>();

export async function toggleSave(contentId: string): Promise<boolean> {
  if (savedSet.has(contentId)) {
    savedSet.delete(contentId);
    return false;
  } else {
    savedSet.add(contentId);
    return true;
  }
}

export async function isSaved(contentId: string): Promise<boolean> {
  return savedSet.has(contentId);
}