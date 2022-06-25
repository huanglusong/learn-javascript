// 学习Promise的基本使用

// --------------- 启动 --------------
// 匿名函数+即时使用函数的使用
(() => {
    // useAsyncDemo();
    useCallBackDemo();
    // cbHellDemo();
    // basicPromiseDemo1();
    // basicPromiseDemo2();
    // basicPromiseDemo3();
    // basicPromiseDemo4();
    // asyncDemo();
})();

// 在js中使用异步 一般直接使用setTimeout函数
function useAsyncDemo() {
    console.log('11111111111')
    setTimeout(() => {
        console.log('22222222222')
    }, 0)
    console.log('333333333333')
}

// 回调函数的例子
// 有了回调函数，实现了直到异步返回结果后再执行回调函数的效果
function useCallBackDemo() {
    function cb(res) {
        console.log('我是一个回调函数，我接收并打印一个参数：', res);
    }

    setTimeout(() => {
        let res = 100;
        console.log('异步计算了2s得到一个结果：', res);
        console.log('调用回调函数开始：', cb);
        cb(res);
    }, 2000);
}

// 什么是回调地狱
// 体现在层层嵌套
function cbHellDemo() {
    // 模拟get操作，get操作一般耗时，异步执行
    // 接收一个回调函数的参数
    function get(cb) {
        setTimeout(() => {
            let res = Math.round(Math.random() * 10);
            console.log('1s后从服务端响应的数据：', res);
            cb(res);
        }, 1000)
    }
    get((res) => {
        console.log('我是cb1，我获得的结果是：', res);
        console.log('cb1还需继续发送get请求！');
        get((res) => {
            console.log('我是cb2，我获得的结果是：', res);
            console.log('cb2还需继续发送get请求！');
            get((res) => {
                console.log('我是cb3，我获得的结果是：', res);
            })
        })
    })
}

// Promise能够优化回调的操作
// 先看看Promise的基本特性
// 输出为1111->2222->3333
// 说明Promise构造的执行器函数会被同步执行
function basicPromiseDemo1() {
    console.log('111111111111')
    let p1 = new Promise(resolve => {
        console.log('2222222222222')
        resolve();
    })
    console.log('3333333333333')
}

// 输出为111111 33333333333 2222222222
// Promise的执行器函数逻辑运行到resolve时，期约会落定
// 落定后的期约会触发兑付或拒绝事件，体现在then方法中定义的相关事件被调用
// 从结果看出即使resolve先于最后的console.log('333333')执行，其事件的触发逻辑还是较靠后执行
// 原因是事件触发的执行逻辑是异步的
function basicPromiseDemo2() {
    let p1 = new Promise(resolve => {
        console.log('1111111111');
        resolve('22222222222');
    });
    p1.then(value => {
        console.log(value);
    })
    console.log('33333333333333')
}

// 通过Promise很优雅实现：等到异步计算结果返回后再执行后续逻辑 这件事。
function basicPromiseDemo3() {
    new Promise(resolve => {
        setTimeout(() => {
            let res = 100;
            console.log('异步计算了1s得到一个结果：', res);
            resolve(res);
        }, 1000)
    }).then(value => {
        console.log('从异步计算结束后接收到的值为：', value);
    })
}

// 使用Promise解决回调地狱的问题！
// 形式上体现为链式调用，无论是阅读还是编写都友好了很多
// 一定程度上可以理解为异步转同步
function basicPromiseDemo4() {
    function get() {
        return new Promise(resolve => {
            setTimeout(() => {
                let res = Math.round(Math.random() * 10);
                console.log('1s后从服务端响应的数据：', res);
                resolve(res);
            }, 1000);
        })
    }

    get().then(value => {
        console.log('then1，从服务端接收到的数据是：', value);
        console.log('then1还需要继续请求服务端！');
        return get();
    }).then(value => {
        console.log('then2，从服务端接收到的数据是：', value);
        console.log('then2还需要继续请求服务端！');
        return get();
    }).then(value => {
        console.log('then3，从服务端接收到的数据是：', value);
        console.log('then3还需要继续请求服务端！');
        return get();
    }).then(value => {
        console.log('then4，从服务端接收到的数据是：', value);
        console.log('then4还需要继续请求服务端！');
        return get();
    }).then(value => {
        console.log('then5，从服务端接收到的数据是：', value);
    })
}

// 异步转同步的另一种方式：可通过async await的方式，此为es2018中新增的特性
function asyncDemo() {
    function get() {
        return new Promise(resolve => {
            setTimeout(() => {
                let res = Math.round(Math.random() * 10);
                console.log('1s后从服务端响应的数据：', res);
                resolve(res);
            }, 1000);
        })
    }
    (async () => {
        let res = undefined;
        res = await get();
        console.log(`当前时间${Date.now()}，从服务端获取的数据是：${res}`);
        res = await get();
        console.log(`当前时间${Date.now()}，从服务端获取的数据是：${res}`);
        res = await get();
        console.log(`当前时间${Date.now()}，从服务端获取的数据是：${res}`);
        res = await get();
        console.log(`当前时间${Date.now()}，从服务端获取的数据是：${res}`);
        res = await get();
        console.log(`当前时间${Date.now()}，从服务端获取的数据是：${res}`);
    })()
}
