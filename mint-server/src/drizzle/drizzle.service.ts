import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from 'src/db';

@Injectable()
export class DrizzleService {
  client: typeof db = db

  async getUserProfileById(id: number) {
    const result = await this.client.query.user_profiles_table.findFirst({
      columns: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
      },
      with: {
        subscription: {
          columns: {
            id: true,
            name: true,
          }
        },
        registrations: {
          columns: {
            id: true,
            bib_number: true,
            bib_alias: true,
          },
          with: {
            race: true
          }
        },
        sponsors: {
          columns: {},
          with: {
            sponsor: true
          }
        },
        country: {
          columns: {
            id: true,
            flag_emoji: true,
            english_translation: true,
            french_translation: true,
            self_translation: true,
          }
        },
        avatar: {
          columns: {
            id: true,
            url: true,
          }
        },
        banner: {
          columns: {
            id: true,
            url: true,
          }
        }
      }
    })

    if(!result) throw new NotFoundException()

    return {
      ...result,
      sponsors: result.sponsors.map(s => s.sponsor)
    }
  }
}
