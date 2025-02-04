'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '../ui/card';
import { EyeIcon, MessageSquareWarningIcon } from 'lucide-react';
import { AgencySocialMediaInfo } from '@/lib/models/agency';
import { useEffect, useState } from 'react';

// Define the schema for the SocialMedia form using Zod
const socialMediaSchema = z.object({
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  linkedIn: z.string().optional(),
  whatsapp: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  telegram: z.string().optional()
});

export type SocialMediaFormValue = z.infer<typeof socialMediaSchema>;

export function SocialMediaForm({
  oldSocialInfo,
  onSubmitCompleteAction
}: {
  oldSocialInfo: AgencySocialMediaInfo | null;
  onSubmitCompleteAction: (data: AgencySocialMediaInfo) => void;
}) {
  const [errorMessage, setErrorMessage] = useState('');
  const form = useForm<SocialMediaFormValue>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      facebook: oldSocialInfo?.facebook ?? '',
      twitter: oldSocialInfo?.twitter ?? '',
      instagram: oldSocialInfo?.instagram ?? '',
      linkedIn: oldSocialInfo?.linkedIn ?? '',
      whatsapp: oldSocialInfo?.whatsapp ?? '',
      tiktok: oldSocialInfo?.tiktok ?? '',
      youtube: oldSocialInfo?.youtube ?? '',
      telegram: oldSocialInfo?.telegram ?? ''
    }
  });

  const onSubmit = async (data: SocialMediaFormValue) => {};

  // Trigger form submission whenever isSubmitting is true

  const generatePreviewLink = (platform: string, value: string | undefined) => {
    if (!value) return '';

    switch (platform) {
      case 'facebook':
        return `https://facebook.com/${value}`;
      case 'twitter':
        return `https://twitter.com/${value}`;
      case 'instagram':
        return `https://instagram.com/${value}`;
      case 'linkedIn':
        return `https://linkedin.com/in/${value}`;
      case 'whatsapp':
        return `https://wa.me/${value}`;
      case 'tiktok':
        return `https://www.tiktok.com/@${value}`;
      case 'youtube':
        return `https://www.youtube.com/@${value}`;
      case 'telegram':
        return `https://t.me/${value}`;
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Information</CardTitle>
        <CardDescription>
          Please provide your social media usernames or channels.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-6">
              {/* Facebook */}
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <div className="flex w-full items-center space-x-2">
                        <Input
                          id="facebook"
                          type="text"
                          placeholder="Facebook Username"
                          {...field}
                        />
                        {field.value && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              window.open(
                                generatePreviewLink('facebook', field.value),
                                '_blank'
                              );
                            }}
                          >
                            <EyeIcon className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">Preview</span>
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Twitter */}
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <div className="flex w-full items-center space-x-2">
                        <Input
                          id="twitter"
                          type="text"
                          placeholder="Twitter Username"
                          {...field}
                        />
                        {field.value && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open(
                                generatePreviewLink('twitter', field.value),
                                '_blank'
                              )
                            }
                          >
                            <EyeIcon className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">Preview</span>
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Instagram */}
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <div className="flex w-full items-center space-x-2">
                        <Input
                          id="instagram"
                          type="text"
                          placeholder="Instagram Username"
                          {...field}
                        />
                        {field.value && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open(
                                generatePreviewLink('instagram', field.value),
                                '_blank'
                              )
                            }
                          >
                            <EyeIcon className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">Preview</span>
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* LinkedIn */}
              <FormField
                control={form.control}
                name="linkedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <div className="flex w-full items-center space-x-2">
                        <Input
                          id="linkedIn"
                          type="text"
                          placeholder="LinkedIn Username"
                          {...field}
                        />
                        {field.value && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open(
                                generatePreviewLink('linkedIn', field.value),
                                '_blank'
                              )
                            }
                          >
                            <EyeIcon className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">Preview</span>
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* WhatsApp */}
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <div className="flex w-full items-center space-x-2">
                        <Input
                          id="whatsapp"
                          type="text"
                          placeholder="WhatsApp Phone Number"
                          {...field}
                        />
                        {field.value && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open(
                                generatePreviewLink('whatsapp', field.value),
                                '_blank'
                              )
                            }
                          >
                            <EyeIcon className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">Preview</span>
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TikTok */}
              <FormField
                control={form.control}
                name="tiktok"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TikTok</FormLabel>
                    <FormControl>
                      <div className="flex w-full items-center space-x-2">
                        <Input
                          id="tiktok"
                          type="text"
                          placeholder="TikTok Username"
                          {...field}
                        />
                        {field.value && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open(
                                generatePreviewLink('tiktok', field.value),
                                '_blank'
                              )
                            }
                          >
                            <EyeIcon className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">Preview</span>
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* YouTube */}
              <FormField
                control={form.control}
                name="youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube</FormLabel>
                    <FormControl>
                      <div className="flex w-full items-center space-x-2">
                        <Input
                          id="youtube"
                          type="text"
                          placeholder="YouTube Channel Name"
                          {...field}
                        />
                        {field.value && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open(
                                generatePreviewLink('youtube', field.value),
                                '_blank'
                              )
                            }
                          >
                            <EyeIcon className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">Preview</span>
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Telegram */}
              <FormField
                control={form.control}
                name="telegram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telegram</FormLabel>
                    <FormControl>
                      <div className="flex w-full items-center space-x-2">
                        <Input
                          id="telegram"
                          type="text"
                          placeholder="Telegram Username"
                          {...field}
                        />
                        {field.value && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open(
                                generatePreviewLink('telegram', field.value),
                                '_blank'
                              )
                            }
                          >
                            <EyeIcon className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">Preview</span>
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              {errorMessage && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <MessageSquareWarningIcon className="h-5 w-5" />
                  <p>{errorMessage}</p>
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
