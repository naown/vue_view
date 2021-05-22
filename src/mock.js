const Mock = require('mockjs')

const Random = Mock.Random

let Result = {
    code : 200,
    msg : '操作成功',
    data : null
}

Mock.mock('/captcha','get',() => {
    Result.data = {
        token: Random.string(32),
        captchaImg: Random.dataImage('104x40', 'e8er7')
    }
    return Result
})

Mock.mock('/login','post',() => {

    return Result
})

Mock.mock('/sys/userInfo','get',() => {

    Result.data = {
        id: '1',
        username: 'Admin',
        avatar: 'https://cdn.jsdelivr.net/gh/naown/imgs@main/user.png'
    }
    return Result
})

Mock.mock('/logout','post',() => {

    return Result
})

Mock.mock('/sys/menu/nav','get',() => {

    let nav = [
        {
            title: '系统管理',
            name: 'SysMange',
            icon: 'el-icon-s-operation',
            path: '',
            component: '',
            children: [
                {
                    title: '用户管理',
                    name: 'SysUser',
                    icon: 'el-icon-s-custom',
                    path: '/system/user',
                    component: 'system/User',
                    children: []
                },
                {
                    title: '角色管理',
                    name: 'SysRole',
                    icon: 'el-icon-rank',
                    path: '/system/role',
                    component: 'system/Role',
                    children: []
                },
                {
                    title: '菜单管理',
                    name: 'SysMenu',
                    icon: 'el-icon-menu',
                    path: '/system/menu',
                    component: 'system/Menu',
                    children: []
                }
            ]
        },
        {
            title: '系统工具',
            name: 'SysTools',
            icon: 'el-icon-s-tools',
            path: '',
            component: '',
            children: [
                {
                    title: '数据字典',
                    name: 'SysDict',
                    icon: 'el-icon-s-order',
                    path: '/system/dict',
                    component: 'Login',
                    children: []
                }
            ]
        }
    ]

    let authorizations = ['sys:user:save','sys:user:del']

    Result.data = {
        nav: nav,
        authorizations: authorizations
    }

    return Result
})

Mock.mock('/sys/menu/list','get',() => {

    Result.data = [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        status: 1,
        type: 0
    }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        status: 0
    }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        type: 0,
        children: [{
            id: 31,
            date: '2016-05-01',
            name: '王小虎菜单',
            address: '上海市普陀区金沙江路 1519 弄',
            type: 1
        }, {
            id: 32,
            date: '2016-05-01',
            name: '王小虎菜单',
            address: '上海市普陀区金沙江路 1519 弄',
            type: 2
        }]
    }]

    return Result
})

Mock.mock('/sys/menu/update','post',() => {
    return Result
})

Mock.mock('/sys/menu/delete/1','post',() => {
    return Result
})

Mock.mock(RegExp('/sys/role/list*'),'get',() => {

    Result.data = [{
        id: 1,
        name: '超级管理员',
        code: '2016-05-03',
        description: '上海市普陀区金沙江路 1518 弄',
        status: 1
    }, {
        id: 2,
        name: '普通用户',
        code: '2016-05-02',
        description: '上海市普陀区金沙江路 1518 弄',
        status: 0
    }]

    return Result
})

Mock.mock('/sys/role/delete','post',() => {
    return Result
})

Mock.mock(RegExp('/sys/role/info/*'),'get',() => {
    Result.data = {
        'id': '6',
        'created': '2021-01-16',
        'updated': '2021-01-16',
        'status': 1,
        'name': '超级管理员',
        'code': 'admin',
        'description': '系统管理员默认拥有全部权限',
        'menuIds': [2]
    }
    return Result
})

Mock.mock(RegExp('/sys/role/perm/*'),'post',() => {

    return Result
})

Mock.mock(RegExp('/sys/user/list*'),'get',() => {

    Result.data = [{
        id: 1,
        avatar:'https://cdn.jsdelivr.net/gh/naown/imgs@main/user.png',
        username: 'admin',
        roles: [
            {
                name: '普通用户'
            }
        ],
        email: '1888926216@gamil.com',
        phone: '123454648',
        created: '2021-5-6',
        status: 1
    }, {
        id: 2,
        avatar:'https://cdn.jsdelivr.net/gh/naown/imgs@main/user.png',
        username: 'guest',
        roles: [
            {
                name: '超级管理员'
            },
            {
                name: '普通用户'
            }
        ],
        email: '1888926216@gamil.com',
        phone: '123454648',
        created: '2021-5-6',
        status: 0
    }]

    return Result
})

Mock.mock(RegExp('/sys/user/role/*'),'post',() => {

    return Result
})

Mock.mock(RegExp('/sys/user/info/*'),'get',() => {
    Result.data = {
        'id': '6',
        'created': '2021-01-16',
        'updated': '2021-01-16',
        'status': 1,
        'name': '超级管理员',
        'code': 'admin',
        'description': '系统管理员默认拥有全部权限',
        'roleIds': [2]
    }
    return Result
})

Mock.mock(RegExp('/sys/user/repass*'),'post',() => {

    return Result
})

Mock.mock(RegExp('/sys/user/delete/*'),'post',() => {

    return Result
})

Mock.mock(RegExp('/sys/user/*'),'post',() => {

    return Result
})
