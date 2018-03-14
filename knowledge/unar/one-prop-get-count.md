```
new Unar({
    data:{
        a:1,
        b:2
    },
    watchers:{
        a(val,old){

        }
    }
})
```
## four get ways 

``` 
     |--- watch -->new Hub 
     |--- cb(vm[a])  init view()  
     |--- register -->new Hub
     |--- ccb init view() push Hub
```


## instance
```
a :1,watch -->register--> new Hub --> get a
   2,cb(vm[a]) --> init a view --> get a
b :cb(vm[b]) --> init b view --> get b
    register-->new Hub --> get b
```
