export function generateObjectQualifiedName<
  Package extends string,
  Class extends string,
>(packageName: Package, objectName: Class) {
  return `${packageName}.${objectName}` as const;
}

export function generateObjectUrl(
  packageUrl: string,
  objectName: string,
): string {
  return `${packageUrl.replace(/\./g, '/')}/${objectName}.html`;
}
