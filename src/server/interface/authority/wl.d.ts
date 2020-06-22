type RA = ReadonlyArray<string>

declare const AuthorityList: [
  /* <<<<<<<< 功能权限 >>>>>>>> */
  /* <<<<<<<< 门店 >>>>>>>> */
  'store',
]

type AuthorityWL = {
  [authority in (typeof AuthorityList)[number]]: RA
}

// eslint-disable-next-line no-undef
export default AuthorityWL
