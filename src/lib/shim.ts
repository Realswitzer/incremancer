const _API = {
    stats: { submit: (key, data) => { } },
    services: {
        getGameAuthToken: () => { return '' }
        ,
        getUserId: () => { return 1 }
    }
}

const kongregateAPI = { loadAPI: (callback: Function) => { }, getAPI: () => { return _API } }

function _UserData(a: object, b: Function, c: Function) { }
const PlayFab = { ClientApi: { UpdateUserData: _UserData, GetUserData: _UserData }, settings: { titleId: '' } }
const PlayFabClientSDK = { LoginWithKongregate: (a, b, c) => { } }
export { kongregateAPI, PlayFab, PlayFabClientSDK };