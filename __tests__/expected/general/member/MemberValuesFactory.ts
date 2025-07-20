export function generateMemberUrl(objectUrl: string, memberId: string): string {
  return `${objectUrl}#${memberId}`;
}
