import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getStudentProfile, updateStudentProfile } from "@/services/api";
import { useEffect } from "react";
import { Textarea } from "./../ui/textarea";

// Zod schema for validation
const profileFormSchema = z.object({
    permanent_address: z.string().min(10, "Address is too short"),
    contact_no: z.string().regex(/^[6-9]\d{9}$/, "Must be a valid 10-digit Indian mobile number"),
    tenth_marks: z.coerce.number().min(0).max(100, "Must be a valid percentage"),
    twelfth_marks: z.coerce.number().min(0).max(100, "Must be a valid percentage"),
    project_count: z.coerce.number().int().min(0),
    resume: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface StudentDataEntryFormProps {
    usn: string;
}

const StudentDataEntryForm = ({ usn }: StudentDataEntryFormProps) => {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            permanent_address: "",
            contact_no: "",
            project_count: 0
        }
    });

    useEffect(() => {
        // Fetch existing profile data when the component mounts
        const loadProfile = async () => {
            try {
                const data = await getStudentProfile(usn);
                // Use form.reset to populate the form with fetched data
                form.reset({
                    permanent_address: data.permanent_address || "",
                    contact_no: data.contact_no || "",
                    tenth_marks: data.tenth_marks || undefined,
                    twelfth_marks: data.twelfth_marks || undefined,
                    project_count: data.project_count || 0,
                });
            } catch (error) {
                console.error("Could not load student profile", error);
                toast.error("Could not load your profile data.");
            }
        };
        loadProfile();
    }, [usn, form]);


    const fileRef = form.register("resume");

    async function onSubmit(data: ProfileFormValues) {
        const formData = new FormData();

        // Append all form fields to formData
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'resume' && value !== null && value !== undefined) {
                formData.append(key, String(value));
            }
        });

        // Append the file if it exists
        if (data.resume && data.resume[0]) {
            formData.append('resume', data.resume[0]);
        }

        toast.loading("Updating profile...");
        try {
            const response = await updateStudentProfile(usn, formData);
            toast.dismiss();
            toast.success(response.message);
        } catch (error: any) {
            toast.dismiss();
            toast.error(error.response?.data?.message || "Failed to update profile.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="contact_no"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Number</FormLabel>
                                <FormControl><Input placeholder="9876543210" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tenth_marks"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>10th Marks (%)</FormLabel>
                                <FormControl><Input type="number" step="0.01" placeholder="95.5" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="twelfth_marks"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>12th/Diploma Marks (%)</FormLabel>
                                <FormControl><Input type="number" step="0.01" placeholder="88.0" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="project_count"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of Projects</FormLabel>
                                <FormControl><Input type="number" placeholder="3" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="md:col-span-2">
                        <FormField
                            control={form.control}
                            name="permanent_address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Permanent Address</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="123, Maple Street, Bengaluru, Karnataka - 560001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <FormField
                            control={form.control}
                            name="resume"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Upload New Résumé (PDF)</FormLabel>
                                    <FormControl><Input type="file" accept=".pdf" {...fileRef} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button type="submit">Update Profile</Button>
            </form>
        </Form>
    );
};

export default StudentDataEntryForm;