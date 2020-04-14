<?php
// 管理员账号信息
$config['adm_user'] = array(
    array(
        'username'  => 'admin',
        'password'  => '123456',
        'role'      => 'admin'
    ),
    array(
        'username'  => 'editor',
        'password'  => '123456',
        'role'      => 'editor',
    ),
    array(
        'username'  => 'referee',
        'password'  => '123456',
        'role'      => 'referee'
    )
);

// 菜单权限配置
$config['adm_pms'] = array(
    'admin' => array()
);
