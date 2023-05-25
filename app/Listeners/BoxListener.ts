import type { EventsList } from '@ioc:Adonis/Core/Event'
import Database from '@ioc:Adonis/Lucid/Database'

export default class BoxListener {
  public async onBoxViewing(box: EventsList['box:viewing']) {
    await this.incrementBoxViewCount(box)
  }

  private async incrementBoxViewCount(box: EventsList['box:viewing']) {
    await Database.transaction(async (trx) => {
      box.viewCount += 1
      box.useTransaction(trx)
      await box.save()
    })
  }
}
