import React from "react";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import Logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="flex gap-20 h-screen w-full px-40 py-28">
      <div className="w-1/2 bg-muted rounded-xl p-12">
        <div className="flex items-center gap-3">
          <img className="h-8" src={Logo} alt="logo" />
          <h2 className="text-2xl tracking-widest font-medium mb-0.5">
            get<span className="text-primary">it</span>done.
          </h2>
        </div>
        <h2 className="mt-24 text-4xl leading-[50px] font-medium">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        </h2>
        <p className="mt-10 text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
          debitis dolore, dicta fugiat iure quia! Hic facilis aut ducimus
          aliquam blanditiis ex ea. Ipsa omnis quas impedit maiores ad unde?
        </p>
        <div className="bg-foreground text-background p-8 rounded-xl mt-16 leading-8">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet
          quasi molestias molestiae, pariatur, doloribus neque saepe sit hic
          quis sequi nulla non quidem accusantium harum ipsa minima adipisci
          iure obcaecati!
        </div>
      </div>
      <div className="flex flex-col justify-center w-1/2 px-20">
        <div>
          <h1 className="text-3xl font-medium">Cadastre-se agora</h1>
          <p className="mt-4 text-muted-foreground font-normal text-lg">
            Crie sua conta agora mesmo
          </p>
          <form className="mt-10">
            <p className="text-muted-foreground mb-2.5">Nome completo</p>
            <Input type="text" />
            <p className="mt-5 text-muted-foreground mb-2.5">E-mail</p>
            <Input type="email" />
            <p className="mt-5 text-muted-foreground mb-2.5">Senha</p>
            <Input type="password" />
            <Button size="xl" className="mt-10 text-lg w-full">
              Criar minha conta
            </Button>
          </form>
          <div className="mt-12 flex justify-center gap-2 text-lg">
            <p>Já tem uma conta?</p>
            <Link to="/login" className="text-primary">
              Entre agora.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
