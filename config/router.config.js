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
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
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
            authority: ['Admin'],
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
            authority: ['Admin'],
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
            path: '/roombooking/roomone',
            name: 'all',
            component: './Rooms/CardList',
          },
          {
            path: '/roombooking/roomtwo',
            name: 'other',
            component: './Rooms/Card2List',
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
            authority: ['Admin'],
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
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
