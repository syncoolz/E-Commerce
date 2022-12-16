import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ){}

    async validateUser(email:string,pass:string):Promise<any>{
        const user = await this.userService.findOne(email);
        console.log(user)
        if (user && user.password === pass){
            const { password, ...result } = user;
            return result
        }
        return null
    }
    
    async login(user : any):Promise<any> {
        const payload = { email: user.email, sub: user.userId };
        const userr = await this.userService.findOne(user.email);
        if (userr){
            const { password, ...result } = userr;
            return {
                ...result,
                token: this.jwtService.sign(payload),
            }
        }else{
            return {
                email: user.email,
                token: this.jwtService.sign(payload),
            };
        }
    }

    async register(user : any):Promise<any>{
        try{
            const payload = { email: user.email, sub: user.userId };
            return {
                email: user.email,
                token: this.jwtService.sign(payload),
            };
        }catch{
           return {error: "This user is already registered."}         
        }     
    }

    async logout(user : any):Promise<any>{
        try{
            return {
                email: "",
                token: "",
            };
        }catch{
           return {error: "This user is not logout."}         
        }     
    }
}
