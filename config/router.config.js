export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/Workplace' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          // {
          //   path: '/dashboard/analysis',
          //   name: 'analysis',
          //   component: './Dashboard/Analysis',
          // },
          // {
          //   path: '/dashboard/monitor',
          //   name: 'monitor',
          //   component: './Dashboard/Monitor',
          // },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      // notices
      {
        path: '/notices',
        icon: 'form',
        name: 'notices',
        routes: [
          {
            path: '/notices/all',
            name: 'all',
            component: './Posts/BasicList',
          },
          {
            path: '/notices/add',
            name: 'add-new',
            component: './Posts/CreateNotice',
          },
          {
            path: '/notices/single/:id',
            name: 'single',
            hideInMenu: true,
            component: './Posts/BasicProfile',
          },
        ],
      },
      // memo
      {
        path: '/memo',
        icon: 'pushpin',
        name: 'memo',
        routes: [
          {
            path: '/memo/all',
            name: 'all',
            component: './Memo/CardList',
          },
          {
            path: '/memo/add',
            name: 'add-new',
            component: './Memo/CreateMemo',
          },
        ],
      },
      // inout
      {
        path: '/inout',
        icon: 'solution',
        name: 'inout',
        routes: [
          {
            path: '/inout/all',
            name: 'all',
            component: './Inout/TableList',
          },
          {
            path: '/inout/add',
            name: 'add-new',
            component: './Inout/CreateInout',
          },
        ],
      },
      //forms
      // {
      //   path: '/form',
      //   icon: 'form',
      //   name: 'form',
      //   routes: [
      //     {
      //       path: '/form/basic-form',
      //       name: 'basicform',
      //       component: './Forms/BasicForm',
      //     },
      //     {
      //       path: '/form/step-form',
      //       name: 'stepform',
      //       component: './Forms/StepForm',
      //       hideChildrenInMenu: true,
      //       routes: [
      //         {
      //           path: '/form/step-form',
      //           redirect: '/form/step-form/info',
      //         },
      //         {
      //           path: '/form/step-form/info',
      //           name: 'info',
      //           component: './Forms/StepForm/Step1',
      //         },
      //         {
      //           path: '/form/step-form/confirm',
      //           name: 'confirm',
      //           component: './Forms/StepForm/Step2',
      //         },
      //         {
      //           path: '/form/step-form/result',
      //           name: 'result',
      //           component: './Forms/StepForm/Step3',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/form/advanced-form',
      //       name: 'advancedform',
      //       component: './Forms/AdvancedForm',
      //     },
      //   ],
      // },
      // Ride booking
      {
        path: '/ride-booking',
        icon: 'car',
        name: 'ride-booking',
        routes: [
          {
            path: '/ride-booking/all',
            name: 'all',
            component: './RideBooking/TableList',
          },
          {
            path: '/ride-booking/add',
            name: 'add-new',
            component: './RideBooking/CreateRideBooking',
          },
          {
            path: '/ride-booking/destination',
            name: 'destination',
            hideChildrenInMenu: false,
            routes: [
              {
                path: '/ride-booking/destination/list',
                name: 'list',
                component: './RideBooking/DestinationTableList',
              },
              {
                path: '/ride-booking/destination/create',
                name: 'add',
                component: './RideBooking/Destination',
              },
            ],
          },
          {
            path: '/ride-booking/location',
            name: 'location',
            hideChildrenInMenu: false,
            routes: [
              {
                path: '/ride-booking/location/list',
                name: 'list',
                component: './RideBooking/LocationTableList',
              },
              {
                path: '/ride-booking/location/create',
                name: 'add',
                component: './RideBooking/Location',
              },
            ],
          },
        ],
      },
      // room
      {
        path: '/roombooking',
        icon: 'solution',
        name: 'rooms',
        routes: [
          {
            path: '/roombooking',
            name: 'all',
            component: './Rooms/CardList',
          },
        ],
      },
      // gallery
      {
        path: '/gallery',
        icon: 'picture',
        name: 'gallery',
        routes: [
          {
            path: '/gallery/all',
            name: 'all',
            component: './Gallery/BasicList',
          },
          {
            path: '/gallery/add',
            name: 'add-new-gallery',
            component: './Gallery/CreateForm',
          },
          {
            path: '/gallery/single/:id',
            name: 'all',
            component: './Gallery/CardList',
            hideInMenu: true,
          },
          {
            path: '/gallery/photo/add',
            name: 'add-new-photo',
            component: './Gallery/CreatePhotoForm',
          },
          // {
          //   path: '/gallery',
          //   name: 'all',
          //   component: './Gallery/BasicList',
          // },
          // {
          //   path: '/gallery/category/create',
          //   name: 'create-gallery',
          //   component: './Gallery/Location',
          // },
        ],
      },
      // list
      // {
      //   path: '/list',
      //   icon: 'table',
      //   name: 'list',
      //   routes: [
      //     {
      //       path: '/list/table-list',
      //       name: 'searchtable',
      //       component: './List/TableList',
      //     },
      //     {
      //       path: '/list/basic-list',
      //       name: 'basiclist',
      //       component: './List/BasicList',
      //     },
      //     {
      //       path: '/list/card-list',
      //       name: 'cardlist',
      //       component: './List/CardList',
      //     },
      //     {
      //       path: '/list/search',
      //       name: 'searchlist',
      //       component: './List/List',
      //       routes: [
      //         {
      //           path: '/list/search',
      //           redirect: '/list/search/articles',
      //         },
      //         {
      //           path: '/list/search/articles',
      //           name: 'articles',
      //           component: './List/Articles',
      //         },
      //         {
      //           path: '/list/search/projects',
      //           name: 'projects',
      //           component: './List/Projects',
      //         },
      //         {
      //           path: '/list/search/applications',
      //           name: 'applications',
      //           component: './List/Applications',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   path: '/profile',
      //   name: 'profile',
      //   icon: 'profile',
      //   routes: [
      //     // profile
      //     {
      //       path: '/profile/basic',
      //       name: 'basic',
      //       component: './Profile/BasicProfile',
      //     },
      //     {
      //       path: '/profile/basic/:id',
      //       name: 'basic',
      //       hideInMenu: true,
      //       component: './Profile/BasicProfile',
      //     },
      //     {
      //       path: '/profile/advanced',
      //       name: 'advanced',
      //       component: './Profile/AdvancedProfile',
      //     },
      //   ],
      // },
      // {
      //   name: 'result',
      //   icon: 'check-circle-o',
      //   path: '/result',
      //   routes: [
      //     // result
      //     {
      //       path: '/result/success',
      //       name: 'success',
      //       component: './Result/Success',
      //     },
      //     { path: '/result/fail', name: 'fail', component: './Result/Error' },
      //   ],
      // },
      // {
      //   name: 'exception',
      //   icon: 'warning',
      //   path: '/exception',
      //   routes: [
      //     // exception
      //     {
      //       path: '/exception/403',
      //       name: 'not-permission',
      //       component: './Exception/403',
      //     },
      //     {
      //       path: '/exception/404',
      //       name: 'not-find',
      //       component: './Exception/404',
      //     },
      //     {
      //       path: '/exception/500',
      //       name: 'server-error',
      //       component: './Exception/500',
      //     },
      //     {
      //       path: '/exception/trigger',
      //       name: 'trigger',
      //       hideInMenu: true,
      //       component: './Exception/TriggerException',
      //     },
      //   ],
      // },
      // {
      //   name: 'account',
      //   icon: 'user',
      //   path: '/account',
      //   routes: [
      //     {
      //       path: '/account/center',
      //       name: 'center',
      //       component: './Account/Center/Center',
      //       routes: [
      //         {
      //           path: '/account/center',
      //           redirect: '/account/center/articles',
      //         },
      //         {
      //           path: '/account/center/articles',
      //           component: './Account/Center/Articles',
      //         },
      //         {
      //           path: '/account/center/applications',
      //           component: './Account/Center/Applications',
      //         },
      //         {
      //           path: '/account/center/projects',
      //           component: './Account/Center/Projects',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: './Account/Settings/Info',
      //       routes: [
      //         {
      //           path: '/account/settings',
      //           redirect: '/account/settings/base',
      //         },
      //         {
      //           path: '/account/settings/base',
      //           component: './Account/Settings/BaseView',
      //         },
      //         {
      //           path: '/account/settings/security',
      //           component: './Account/Settings/SecurityView',
      //         },
      //         {
      //           path: '/account/settings/binding',
      //           component: './Account/Settings/BindingView',
      //         },
      //         {
      //           path: '/account/settings/notification',
      //           component: './Account/Settings/NotificationView',
      //         },
      //       ],
      //     },
      //   ],
      // },
      //  editor
      // {
      //   name: 'editor',
      //   icon: 'highlight',
      //   path: '/editor',
      //   routes: [
      //     {
      //       path: '/editor/flow',
      //       name: 'flow',
      //       component: './Editor/GGEditor/Flow',
      //     },
      //     {
      //       path: '/editor/mind',
      //       name: 'mind',
      //       component: './Editor/GGEditor/Mind',
      //     },
      //     {
      //       path: '/editor/koni',
      //       name: 'koni',
      //       component: './Editor/GGEditor/Koni',
      //     },
      //   ],
      // },
      {
        component: '404',
      },
    ],
  },
];
