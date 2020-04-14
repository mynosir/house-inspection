<?php
if(!function_exists('get_value')) {
    function get_value(&$arr, $key, $default='') {
        if(isset($arr[$key])) {
            return $arr[$key];
        } else {
            return $default;
        }
    }
}


if(!function_exists('create_datagrid_data')) {
    function create_datagrid_data($total, $rows) {
        return array('total'=>$total, 'rows'=>$rows);
    }
}


if(!function_exists('get_datagrid_page')) {
    function get_datagrid_page() {
        $index = get_value($_POST, 'page', 1);
        $size = get_value($_POST, 'rows', 50);
        if($index<=0) {
            $index = 1;
        }
        return array('index'=>$index, 'size'=>$size);
    }
}


if(!function_exists('get_datagrid_order')) {
    function get_datagrid_order() {
        $sort = get_value($_POST, 'sort', '');
        $order = get_value($_POST, 'order', '');
        if($sort=='') {
            return array();
        } else {
            $result = array();
            $arr_sort = explode(',', $sort);
            $arr_order = explode(',', $order);
            foreach($arr_sort as $key=>$val) {
                array_push($result, $arr_sort[$key] . ' ' . $arr_order[$key]);
            }
            return $result;
        }
    }
}


if(!function_exists('create_tree_list')) {
    function create_tree_list(&$input, &$output, $pid=0, $level=0, $config=array('id_key'=>'id', 'pid_key'=>'pid')) {
        $id_key = $config['id_key'];
        $pid_key = $config['pid_key'];
        $num = count($input);
        for($i=0; $i<$num; $i++) {
            if($input[$i][$pid_key]==$pid) {
                $input[$i]['level'] = $level;
                $input[$i]['is_leaf'] = true;
                $output[$input[$i][$id_key]] = $input[$i];
                if($pid>0) {
                    $output[$pid]['is_leaf'] = false;
                }
                create_tree_list($input, $output, $input[$i][$id_key], ($level+1), $config);
            }
        }
    }
}


if(!function_exists('is_username')) {
    function is_username($username) {
        $strlen = strlen($username);
        if(!preg_match("/^[a-zA-Z0-9_][a-zA-Z0-9_]+$/", $username)) {
            return false;
        } elseif ( 20 < $strlen || $strlen < 2 ) {
            return false;
        }
        return true;
    }
}


if(!function_exists('is_realname')) {
    function is_realname($realname) {
        $strlen = strlen($realname);
        if(!preg_match("/^[a-zA-Z\x7f-\xff][a-zA-Z\x7f-\xff]+$/", $realname)) {
            return false;
        } elseif ( 20 < $strlen || $strlen < 2 ) {
            return false;
        }
        return true;
    }
}


if(!function_exists('generate_code')) {
    function generate_code($length = 4) {
        return rand(pow(10, ($length - 1)), pow(10, $length) - 1);
    }
}


/**
 * 生成随机数
 * @param  integer $length 随机数长度，默认为3
 * @return [type]          [description]
 */
function myrandom($length=3) {
    $pattern = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLOMNOPQRSTUVWXYZ';
    $key = '';
    for($i=0; $i<$length; $i++) {
        $key .= $pattern { mt_rand(0,35) };
    }
    return $key;
}


/**
 * 图片转base64
 * @param  [type] $image_file [description]
 * @return [type]             [description]
 */
function base64EncodeImage($image_file) {
    return base64_encode(file_get_contents($image_file));
}


/**
 * 保存日志信息
 * @param  [type] $data [description]
 * @param  string $file [description]
 * @return [type]       [description]
 */
function saveLog($data, $file='./public/log/postData') {
    file_put_contents($file, date('Y-m-d H:i:s') . ' => ');
    file_put_contents($file, $data . PHP_EOL, FILE_APPEND);
}


function curl_file_get_contents($durl) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $durl);
    curl_setopt($ch, CURLOPT_TIMEOUT, 2);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $headers = array(
        "Content-type: application/x-www-form-urlencoded",
        "Accept: application/json",
        "Cache-Control: no-cache",
        "Pragma: no-cache",
    );
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $r = curl_exec($ch);
    curl_close($ch);
    return $r;
}