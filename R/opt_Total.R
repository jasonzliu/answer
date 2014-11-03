rm(list=ls())
library(Rsolnp) 
require(RJSONIO)

###objective function

toOptSimple = function(Theta)
{
  coef = c(
    0.0588,
    0.5276,
    0.0568,
    0.0452,
    0.0378,
    0.0506,
    0.1403,
    0.4678    
  )
  
  x1 = log(abs(Theta[1])/4)
  x2 = log(abs(Theta[2])/4)
  x3 = log(abs(Theta[3])/4)
  x4 = log(abs(Theta[4])/4)
  x5 = log(abs(Theta[5])/4)
  x6 = log(abs(Theta[6])/4)
  x7 = log(abs(Theta[7])/4)
  x8 = log(abs(Theta[8])/4)
  
  sales = exp(2.0328+sum(c(x1,x2,x3,x4,x5,x6,x7,x8)*coef))
  
  v1 = (sales-8)*(x1)*coef[1]/sum(c(x1,x2,x3,x4,x5,x6,x7,x8)*coef)
  v2 = (sales-8)*(x2)*coef[2]/sum(c(x1,x2,x3,x4,x5,x6,x7,x8)*coef)
  v3 = (sales-8)*(x3)*coef[3]/sum(c(x1,x2,x3,x4,x5,x6,x7,x8)*coef)
  v4 = (sales-8)*(x4)*coef[4]/sum(c(x1,x2,x3,x4,x5,x6,x7,x8)*coef)
  v5 = (sales-8)*(x5)*coef[5]/sum(c(x1,x2,x3,x4,x5,x6,x7,x8)*coef)
  v6 = (sales-8)*(x6)*coef[6]/sum(c(x1,x2,x3,x4,x5,x6,x7,x8)*coef)
  v7 = (sales-8)*(x7)*coef[7]/sum(c(x1,x2,x3,x4,x5,x6,x7,x8)*coef)
  v8 = (sales-8)*(x8)*coef[8]/sum(c(x1,x2,x3,x4,x5,x6,x7,x8)*coef)
  
  total = 4*(v1+v2+v3+v4+v5+v6+v7+v8)
  #print(c(x1,x2,x3,x4,x5,x6,x7,x8,v1,v2,v3,v4,v5,v6,v7,v8))
  return(-total)
}


#
#Scenario I
#Only "total" as the single input 
#

###inequality functions to require all inputs(Thetas) and middle layers paramters (x1,x2,...) to be in the box restriction 
ineq <- function(Theta) { 
  
  x1 = log(abs(Theta[1])/4)
  x2 = log(abs(Theta[2])/4)
  x3 = log(abs(Theta[3])/4)
  x4 = log(abs(Theta[4])/4)
  x5 = log(abs(Theta[5])/4)
  x6 = log(abs(Theta[6])/4)
  x7 = log(abs(Theta[7])/4)
  x8 = log(abs(Theta[8])/4)
  
  return(c(Theta[1],Theta[2],Theta[3],Theta[4],Theta[5],Theta[6],Theta[7],Theta[8],x1,x2,x3,x4,x5,x6,x7,x8))
}


###equality constrain function that requires the input total
constrainFun1 = function(Theta)
{
  return(Theta[1]+Theta[2]+Theta[3]+Theta[4]+Theta[5]+Theta[6]+Theta[7]+Theta[8])
}

###input variable
#input_total = 521596

###fixed parameter that define the box of restrictions on inputs
x0 = c(50000,50000,50000,50000,50000,50000,50000,50000)
lh <- rep(0,16)
uh <- c(rep(300000,8),rep(20,8))
ctrl = list(delta = 1, tol =0.00000001)

decomp_fun = function(Theta){
    coef = c(
      0.0588,
      0.5276,
      0.0568,
      0.0452,
      0.0378,
      0.0506,
      0.1403,
      0.4678    
    )
    
    x1 = log(abs(Theta[1])/4)
    x2 = log(abs(Theta[2])/4)
    x3 = log(abs(Theta[3])/4)
    x4 = log(abs(Theta[4])/4)
    x5 = log(abs(Theta[5])/4)
    x6 = log(abs(Theta[6])/4)
    x7 = log(abs(Theta[7])/4)
    x8 = log(abs(Theta[8])/4)
    
    sales = exp(2.0328+sum(c(x1,x2,x3,x4,x5,x6,x7,x8)*coef))
    
    v1 = (sales-8)*(x1)*coef[1]/sum(c(x1,x2,x3,x4,x5,x6,x7,x8)*coef)
    v2 = (sales-8)*(x2)*coef[2]/sum(c(x1,x2,x3,x4,x5,x6,x7,x8)*coef)
    v3 = (sales-8)*(x3)*coef[3]/sum(c(x1,x2,x3,x4,x5,x6,x7,x8)*coef)
    v4 = (sales-8)*(x4)*coef[4]/sum(c(x1,x2,x3,x4,x5,x6,x7,x8)*coef)
    v5 = (sales-8)*(x5)*coef[5]/sum(c(x1,x2,x3,x4,x5,x6,x7,x8)*coef)
    v6 = (sales-8)*(x6)*coef[6]/sum(c(x1,x2,x3,x4,x5,x6,x7,x8)*coef)
    v7 = (sales-8)*(x7)*coef[7]/sum(c(x1,x2,x3,x4,x5,x6,x7,x8)*coef)
    v8 = (sales-8)*(x8)*coef[8]/sum(c(x1,x2,x3,x4,x5,x6,x7,x8)*coef)
    return(c(4*v1,4*v2,4*v3,4*v4,4*v5,4*v6,4*v7,4*v8))
}

getOptimal = function(jsonObj){
    o = fromJSON(jsonObj)
    input_total = o$total
    opt_log = capture.output({sol_01 = solnp(x0, fun=toOptSimple, eqfun=constrainFun1, 
	        ineqfun = ineq, eqB=c(input_total), ineqLB = lh, ineqUB=uh, control = ctrl)}) 
    #sol_01$pars
    #toOptSimple(sol_01$pars)
    res = list()
    res$paras = sol_01$pars
	res$decomp_sales = decomp_fun(res$paras)
    #res$total_sales = -toOptSimple(sol_01$pars)
	res$total_sales = sum(res$decomp_sales)
    return(toJSON(res))
}
###optimization and output

#toOptSimple(c(22154,198764,21381,17020,14212,19039,52800,176227))


#
#Scenario II
#"total" and fixed individual channal as the inputs
#

###equality constrain function that requires the input total and fixed input channal amount
#constrainFun2 = function(Theta)
#{
#  return(c(Theta[1]+Theta[2]+Theta[3]+Theta[4]+Theta[5]+Theta[6]+Theta[7]+Theta[8], Theta[2]))
#}

###input variable
#input_total = 521596
#input_theta2 = 100000


###optimization and output
#opt_log2 = capture.output({sol_02 = solnp(x0, fun=toOptSimple, eqfun=constrainFun2, ineqfun = ineq, eqB=c(input_total,input_theta2), 
#                                          ineqLB = lh, ineqUB=uh, control = ctrl)}) 
#sol_02$pars
#toOptSimple(sol_02$pars)
#toOptSimple(c(22154,100000,21381,17020,14212,19039,52800,176227))

#test
#args <- '{"total":[521596]}'
#res <- getOptimal(args)
# fromJSON(res)$pw
