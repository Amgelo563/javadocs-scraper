export const BaseProjectPackage = 'me.amgelo563.javadocsgen' as const;
export const BaseProjectSubPackage = 'javadocsgen' as const;

export function generatePackageName<Package extends string>(
  packageName: Package,
) {
  return `${BaseProjectPackage}.${packageName}` as const;
}

export function generateSubPackageName<
  Package extends string,
  SubPackage extends string,
>(packageName: Package, subPackageName: SubPackage) {
  return `${packageName}.${subPackageName}` as const;
}

export function generatePackageUrl(
  baseUrl: string,
  packageName: string,
): string {
  return `${baseUrl}${packageName.replace(/\./g, '/')}/package-summary.html`;
}
