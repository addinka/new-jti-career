export enum ServiceMapping {

    // Auth URLs
    LOGIN_URL = 'auth/login',
    REQUEST_RESET_USER_PASSWORD_URL = 'auth/request-reset',
    RESET_USER_PASSWORD_URL = 'auth/reset',

    // Job URLs
    CREATE_NEW_JOB_URL = 'job',
    GET_ALL_JOB_URL = 'job',
    GET_ALL_OPEN_JOB_URL = 'job/open',
    SEARCH_JOB = '/job/search-job-ads?search=',
    GET_ALL_AVAILABLE_JOB_URL = 'job/available-jobs',
    GET_ALL_HOT_TITLES_URL = 'job/hot-titles',
    GET_ALL_HOT_ROLES_URL = 'job/hot-roles',
    GET_JOB_BY_ID_URL = 'job/id/', // {id}
    DELETE_JOB_BY_ID_URL = 'job/delete/', // {id}
    SEARCH_JOB_BY_ROLE_URL = 'job/search',
    REPOST_JOB_BY_ID_URL = 'job/repost',
    FOLLOW_JOB_BY_ID_URL = 'job/toggle-follow/',
    CHANGE_JOB_AUTHOR_URL = 'job/author',
    CHANGE_JOB_COLLABORATORS_URL = 'job/collaborators',
    EDIT_JOB_URL = 'job',
    DEACTIVATE_JOB_BY_ID_URL = 'job/deactivate',

    // User URLs
    CREATE_NEW_USER_URL = 'user',
    GET_ALL_USER_URL = 'user',
    UPDATE_USER_URL = 'user',
    GET_USER_BY_TOKEN_URL = 'user/me',
    GET_USER_BY_ID_URL = 'user/id', // {id}
    SEARCH_ALL_USER = 'user/search',
    SEARCH_USER_BY_JOB_ID_URL = 'user/search-by-job-id',
    TOGGLE_POTENTIAL = 'user/toggle-potential/', // {id}
    DELETE_USER_BY_ID_URL = 'user/delete/', // {id}
    UPDATE_PROFILE_PICTURE_URL = 'user/profpic',
    GET_PROFILE_PICTURE_BY_ID_URL = 'user/profpic/', // {id}
    GET_APPLICATION_BY_TOKEN_URL = 'user/applications',
    POST_DOCUMENT_URL = 'user/att/', // {type}
    GET_DOCUMENT_URL = 'user/att/', // {type}
    DELETE_DOCUMENT_URL = 'user/att/', // {type}
    ARCHIVE_DOCUMENT_URL = 'user/archive/att',
    GENERATE_EXCEL = 'user/export',
    SEND_BLUEFORM = 'user/blueform-invite',
    SEND_ONBOARDFORM = 'user/onboard-invite',
    INVITE_APPLY_EXTERNAL = 'user/sign-up-invite',

    // Application URLs
    CREATE_NEW_APPLICATION_URL = 'application/submit',
    GET_ALL_APPLICATION_URL = 'application',
    GET_APPLICATION_BY_ID_URL = 'application/id/', // {id}
    GET_APPLICATION_BY_DATE_URL = 'application/date/', // {date}
    GET_APPLICATION_CALENDER_URL = 'application/calendar/', // {date}
    GET_APPLICANT_BY_FILTER = 'application/filter',
    CANCEL_APPLICATION_BY_ID_URL = 'application/cancel/', // {id}
    DELETE_APPLICATION_BY_ID_URL = 'application/delete/', // {id}
    INVITE_APPLICANT = 'application/invite/', // {type}
    ACCEPT_APPLICANT = 'application/hire/', // {id}

    // Recruiter URLs
    CREATE_NEW_RECRUITER_URL = 'recruiter/',
    GET_ALL_RECRUITER_URL = 'recruiter/',
    CHANGE_ADMIN_STATUS_URL = 'recruiter/toggle-admin/', // {id}
    CHANGE_SUPER_ADMIN_STATUS_URL = 'toggle-super-admin/', // {id}
    SET_RECRUITER_PASSWORD_URL = 'recruiter/set-password',
    GET_RECRUITER_BY_TOKEN_URL = 'me',
    GET_RECRUITER_BY_ID_URL = 'id/', // {id}
    DELETE_RECRUITER_BY_ID_URL = 'recruiter/delete/', // {id}
    CHANGE_ADMIN_ACTIVE_STATUS_URL = 'recruiter/toggle-active/', // {id}

    // Testimony URLs
    GET_ALL_TESTIMONY_URL = 'testimony/',
    CREATE_NEW_TESTIMONY_URL = 'testimony/',
    UPDATE_TESTIMONY_URL = 'testimony/',
    DELETE_TESTIMONY_BY_ID_URL = 'testimony/delete/', // {id}
    GET_TESTIMONY_PICTURE_BY_ID_URL = 'testimony/testimonypic/', // {id}

    // Notification URLs
    GET_USER_NOTIFICATIONS = 'notification/',
    SET_NOTIFICATION_AS_READ = 'notification/read/', // {id}
    DELETE_USER_NOTIFICATIONS = 'notification/delete/', // {id}

    // Blueform URLs
    BLUEFORM = 'blueform',
    DOWNLOAD_BLUEFORM = '/blueform/download',

    // Onboarding Form URLs
    ONBOARDING_FORM = 'user/onboard',
}
