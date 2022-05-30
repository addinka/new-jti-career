export interface AllCandidateFilter {
  allCV                 : number
  allUser               : number
  applied               : number
  bachelor              : number
  d3                    : number
  early                 : number
  english               : number
  freshGrad             : number
  indonesia             : number
  lessThanAMonth        : number
  master                : number
  moreThanThreeMonths   : number
  notApplied            : number
  oneToThreeMonths      : number
  other                 : number
  pro                   : number
  underGrad             : number
  smk                   : number
  d2                    : number
  potential             : number
  open                  : number
  hired                 : number
}

export const InitialCandidateFilter: AllCandidateFilter = {
  allCV                 : 0,
  allUser               : 0,
  applied               : 0,
  bachelor              : 0,
  d3                    : 0,
  early                 : 0,
  english               : 0,
  freshGrad             : 0,
  indonesia             : 0,
  lessThanAMonth        : 0,
  master                : 0,
  moreThanThreeMonths   : 0,
  notApplied            : 0,
  oneToThreeMonths      : 0,
  other                 : 0,
  pro                   : 0,
  underGrad             : 0,
  smk                   : 0,
  d2                    : 0,
  potential             : 0,
  open                  : 0,
  hired                 : 0,
}

export interface AllCandidateFilterGroup {
  language: string[],
  education: string[],
  experience: string[],
  applied: string[],
  cv: string[],
  status: string[],
}
