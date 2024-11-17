"use client";

import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { Download, ImageIcon, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { amountOptions, formSchema, resolutionOption } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";

const ImagePage = () => {
    const router = useRouter();
    const [images, setImages] = useState<string>();

    const form =useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            prompt: "",
            amount: "1",
            resolution: "512x512"
        }
    });

const isLoading = form.formState.isSubmitting;

const onSubmit = async (values: z.infer<typeof formSchema>) => {
   try{
    setImages(undefined);
    const response = await axios.post("/api/image", values);
    
    setImages(response.data[0]);
    form.reset();
   }catch (error: any){
    //todo-> open pro model
    console.log(error);
   }finally{
    router.refresh
   }
};

    return (
      <div>
        <Heading
          title="Image Generation"
          description="Turn Your Text Into Image."
          icon={ImageIcon}
          iconColor="text-pink-700"
          bgColor="bg-pink-700/10"
        />
        <div className="px-4 lg:px-8">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" 
                     rounded-lg
                     border
                     w-full
                     p-4
                     px-3
                     md:px-6
                     focus-within:shadow-sm
                     grid
                     grid-cols-12
                     gap-2
                     "
              >
                <FormField
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-10">
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none
                                    focus-visible:ring-0
                                    focus-visible:transparent"
                          disabled={isLoading}
                          placeholder=" hey input the prompt like generate a picture of rabit."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => {
                    <FormItem className="col-span-12 lg:col-span-2">
                      <Select
                       disabled={isLoading}
                       onValueChange={field.onChange}
                       value={field.value}
                       defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value}/>
                          </SelectTrigger> 
                        </FormControl>
                        <SelectContent>
                          {amountOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              >
                                {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>

                      </Select>
                    </FormItem>
                  }}
                />
                <FormField
                  control={form.control}
                  name="resolution"
                  render={({ field }) => {
                    <FormItem className="col-span-12 lg:col-span-2">
                      <Select
                       disabled={isLoading}
                       onValueChange={field.onChange}
                       value={field.value}
                       defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {resolutionOption.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              >
                                {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>

                      </Select>
                    </FormItem>
                  }}
                />
                <Button
                  className="col-span-12 lg:col-span-2 w-full"
                  disabled={isLoading}>
                  GENERATE
                </Button>
              </form>
            </Form>
          </div>
          <div className="space-y-4 mt-4">
            {isLoading && (
              <div className="p-20">
                <Loader />
              </div>
            )}
            {!images && !isLoading && (
              <Empty label="No image generated." />
            )}
            {images && (
              <video controls className="w-full aspect-video mt-8 rounded-lg border bg-black">
                <source src={images}/>
              </video>
            )}
          </div>
        </div>
      </div>
    );
}

export default ImagePage ;