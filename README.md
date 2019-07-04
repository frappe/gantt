# @gemcook/gantt


## Getting Start


### Install


`yarn add @gemcook/gantt`


### Import


**JavaScript**


`import Gantt from '@gemcook/gantt';`


**SCSS**


`@import '~@gemcook/gantt/lib/styles/index';`


## Usage


```js
const tasks = [
    [
        {
            start: '2019-06-20',
            end: '2019-06-23',
            name: 'Task 1-1',
            id: 'Task 1-1'
        },
        {
            start: '2019-06-26',
            end: '2019-06-29',
            name: 'Task 1-2',
            id: 'Task 1-2',
            progress: 20
        }
    ],
    [
        {
            start: '2019-06-20',
            end: '2019-06-23',
            name: 'Task 2',
            id: 'Task 2'
        }
    ],
    [
        {
            start: '2019-06-20',
            end: '2019-06-23',
            name: 'Task 3',
            id: 'Task 3',
            progress: 10
        }
    ]
];
```


## Contributing


### Install


`yarn`


### Running


`make start`


- Web サーバが起動する訳ではないので、更新の度に `make start` を実行する必要があります


## License


[MIT](https://github.com/gemcook/gantt/blob/release/LICENSE)

